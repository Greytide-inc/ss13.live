// From code/modules/projectiles/guns/grenade_launcher.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5278, "/obj/item/weapon/gun/grenadelauncher", "/obj/item/weapon/gun", {
	max_grenades: 3,
	grenades: null,
	throw_speed: 2,
	throw_range: 7,
	name: "grenade launcher",
	desc: "a terrible, terrible thing. it's really awful!",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "riotgun",
	item_state: "riotgun",
	w_class: 4,
	force: 5,
	materials: null,
});

// /obj/item/weapon/gun/grenadelauncher/proc/<init>  (code/modules/projectiles/guns/grenade_launcher.dm:11)
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "grenades", rt.new_(f, T("/list"), []));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});

// /obj/item/weapon/gun/grenadelauncher/proc/examine  (code/modules/projectiles/guns/grenade_launcher.dm:16)
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ / ＀ grenades loaded.", [rt.len(f, rt.sv(f, "grenades")), rt.sv(f, "max_grenades")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/gun/grenadelauncher/proc/attackby  (code/modules/projectiles/guns/grenade_launcher.dm:21)  may sleep
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/grenade")) ? 1 : 0))) return f.dot;
	if (rt.lt(rt.len(f, rt.sv(f, "grenades")), rt.sv(f, "max_grenades"))) {
		if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(I), live(f.src)])))) {
			return live(f.dot);
		}
		rt.modSrcVar(f, "grenades", live(I), add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You put the grenade in the grenade launcher.</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ / ＀ Grenades.</span>", [rt.len(f, rt.sv(f, "grenades")), rt.sv(f, "max_grenades")])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>The grenade launcher cannot hold more grenades.</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/gun/grenadelauncher/proc/afterattack  (code/modules/projectiles/guns/grenade_launcher.dm:32)  may sleep
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	f.vars = () => [target, user, flag];
	if (isEqual(live(target), live(user))) {
		return live(f.dot);
	}
	if (truthy(rt.len(f, rt.sv(f, "grenades")))) {
		yield* g.srcCall(f, "fire_grenade", live(target), live(user));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>The grenade launcher is empty.</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/gun/grenadelauncher/proc/fire_grenade  (code/modules/projectiles/guns/grenade_launcher.dm:41)  may sleep
rt.def("/obj/item/weapon/gun/grenadelauncher/proc/fire_grenade", function* fire_grenade(f: Frame, target: Value, user: Value) {
	let F: Value = null;
	f.vars = () => [target, user, F];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ fired a grenade!</span>", [live(user)]), "<span class='danger'>You fire the grenade launcher!</span>"]);
	(rt.modSrcVar(f, "grenades", (F = rt.index(rt.sv(f, "grenades"), 1)), subtract));
	rt.setFv(f, "loc", live(F), rt.fv(f, "loc", live(user)));
	yield* g.callName(f, live(F), "throw_at", [live(target), 30, 2, live(user)]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ fired a grenade (＀) from a grenade launcher (＀).", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), rt.fv(f, "name", live(F)), rt.fv(f, "name", live(f.src))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ fired a grenade (＀) from a grenade launcher (＀).", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.fv(f, "name", live(F)), rt.fv(f, "name", live(f.src))])]);
	rt.setFv(f, "active", live(F), 1);
	rt.setFv(f, "icon_state", live(F), add(rt.initial(f, live(F), "icon_state"), "_active"));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(F), P("/obj/item/weapon/grenade/proc/prime")])), 15]);
	return f.dot;
}, true);
