// From code/game/mecha/equipment/weapons/weapons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9628, "/obj/item/mecha_parts/mecha_equipment/weapon", "/obj/item/mecha_parts/mecha_equipment", {
	projectile: null,
	fire_sound: null,
	projectiles_per_shot: 1,
	variance: 0,
	randomspread: 0,
	projectile_delay: 0,
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect"),
	range: 2,
	name: "mecha weapon",
	origin_tech: "materials=3;combat=3",
});

// /obj/item/mecha_parts/mecha_equipment/weapon/proc/can_attach  (code/game/mecha/equipment/weapons/weapons.dm:14)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha/combat")) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/weapon/proc/action  (code/game/mecha/equipment/weapons/weapons.dm:23)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/proc/action", function* action(f: Frame, target: Value, params: Value) {
	let curloc: Value = null, targloc: Value = null, i: Value = null, A: Value = null, spread: Value = null;
	let $e: any;
	f.vars = () => [target, params, curloc, targloc, i, A, spread, $e];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return 0;
	}
	curloc = rt.getStep(f, rt.sv(f, "chassis"), 0);
	if (((!truthy((targloc = rt.getStep(f, live(target), 0))) || !truthy((rt.istype(live(targloc), T("/turf")) ? 1 : 0))) || !truthy(live(curloc)))) {
		return 0;
	}
	if (isEqual(live(targloc), live(curloc))) {
		return 0;
	}
	yield* g.srcCall(f, "set_ready_state", 0);
	i = null;
	rt.forRange(f, 0, 1, (yield* g.srcCall(f, "get_shot_amount")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.setFv(f, "firer", (A = (yield* g.new_(f, rt.sv(f, "projectile"), [live(curloc)]))), rt.fv(f, "occupant", rt.sv(f, "chassis")));
		rt.setFv(f, "original", live(A), live(target));
		rt.setFv(f, "current", live(A), live(curloc));
		if ((!truthy(rt.fv(f, "suppressed", live(A))) && truthy(rt.sv(f, "firing_effect_type")))) {
			yield* g.new_(f, rt.sv(f, "firing_effect_type"), [rt.getStep(f, live(f.src), 0), rt.fv(f, "dir", rt.sv(f, "chassis"))]);
		}
		spread = 0;
		if (truthy(rt.sv(f, "variance"))) {
			if (truthy(rt.sv(f, "randomspread"))) {
				spread = (yield* g.call(f, P("/proc/round"), null, [multiply(subtract((yield* g.call(f, P("/proc/rand"), null, [])), 0.5), rt.sv(f, "variance"))]));
			} else {
				spread = (yield* g.call(f, P("/proc/round"), null, [multiply(subtract(divide(live(i), rt.sv(f, "projectiles_per_shot")), 0.5), rt.sv(f, "variance"))]));
			}
		}
		yield* g.callName(f, live(A), "preparePixelProjectile", [live(target), live(targloc), rt.fv(f, "occupant", rt.sv(f, "chassis")), live(params), live(spread)]);
		yield* g.callName(f, live(A), "fire", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "chassis"), rt.sv(f, "fire_sound"), 50, 1]);
		yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/max"), null, [0, rt.sv(f, "projectile_delay")]))]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "chassis"), "log_message", [fmt("Fired from ＀, targeting ＀.", [rt.fv(f, "name", live(f.src)), live(target)])]);
	return 1;
}, true);

rt.type(9629, "/obj/item/mecha_parts/mecha_equipment/weapon/energy", "/obj/item/mecha_parts/mecha_equipment/weapon", {
	name: "general energy weapon",
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect/energy"),
});

// /obj/item/mecha_parts/mecha_equipment/weapon/energy/proc/get_shot_amount  (code/game/mecha/equipment/weapons/weapons.dm:66)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/energy/proc/get_shot_amount", function get_shot_amount(f: Frame) {
	return rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/round"), null, [divide(rt.gv(f, "charge", rt.fv(f, "cell", rt.sv(f, "chassis"))), rt.sv(f, "energy_drain"))]), rt.sv(f, "projectiles_per_shot")]);
});

// /obj/item/mecha_parts/mecha_equipment/weapon/energy/proc/start_cooldown  (code/game/mecha/equipment/weapons/weapons.dm:69)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/energy/proc/start_cooldown", function* start_cooldown(f: Frame) {
	yield* g.srcCall(f, "set_ready_state", 0);
	yield* g.callName(f, rt.sv(f, "chassis"), "use_power", [multiply(rt.sv(f, "energy_drain"), (yield* g.srcCall(f, "get_shot_amount")))]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/mecha_parts/mecha_equipment/proc/set_ready_state"), 1])), rt.sv(f, "equip_cooldown")]);
	return f.dot;
}, true);

rt.type(9635, "/obj/item/mecha_parts/mecha_equipment/weapon/energy/plasma", "/obj/item/mecha_parts/mecha_equipment/weapon/energy", {
	equip_cooldown: 10,
	energy_drain: 30,
	projectile: rt.typePath("/obj/item/projectile/plasma/adv/mech"),
	fire_sound: rt.rsc("sound/weapons/plasma_cutter.ogg"),
	name: "217-D Heavy Plasma Cutter",
	desc: "A device that shoots resonant plasma bursts at extreme velocity. The blasts are capable of crushing rock and demolishing solid obstacles.",
	icon_state: "mecha_plasmacutter",
	item_state: "plasmacutter",
	origin_tech: "materials=3;plasmatech=4;engineering=3",
});

// /obj/item/mecha_parts/mecha_equipment/weapon/energy/plasma/proc/can_attach  (code/game/mecha/equipment/weapons/weapons.dm:136)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/energy/plasma/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 1;
	} else {
		if ((rt.lt(rt.getLen(f, rt.fv(f, "equipment", live(f.args[0]))), rt.fv(f, "max_equip", live(f.args[0]))) && truthy((rt.istype(live(f.args[0]), T("/obj/mecha/working")) ? 1 : 0)))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

rt.type(9637, "/obj/item/mecha_parts/mecha_equipment/weapon/honker", "/obj/item/mecha_parts/mecha_equipment/weapon", {
	energy_drain: 200,
	equip_cooldown: 150,
	range: 3,
	name: "１HoNkER BlAsT 5000",
	desc: "Equipment for clown exosuits. Spreads fun and joy to everyone around. Honk!",
	icon_state: "mecha_honker",
});

// /obj/item/mecha_parts/mecha_equipment/weapon/honker/proc/can_attach  (code/game/mecha/equipment/weapons/weapons.dm:162)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/honker/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha/combat/honker")) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/weapon/honker/proc/action  (code/game/mecha/equipment/weapons/weapons.dm:168)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/honker/proc/action", function* action(f: Frame, target: Value, params: Value) {
	let M: Value = null, H: Value = null, _T: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [target, params, M, H, _T, $0, $1, $e];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "chassis"), rt.rsc("sound/items/airhorn.ogg"), 100, 1]);
	yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", ["<font color='red' size='5'>HONK</font>"]);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/ohearers"), null, [6, rt.sv(f, "chassis")])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (truthy((rt.istype(rt.gv(f, "ears", (H = live(M))), T("/obj/item/clothing/ears/earmuffs")) ? 1 : 0))) {
				continue;
			}
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<font color='red' size='7'>HONK</font>"]);
		yield* g.callName(f, live(M), "SetSleeping", [0]);
		rt.modField(f, live(M), "stuttering", 20, add);
		yield* g.callName(f, live(M), "adjustEarDamage", [0, 30]);
		yield* g.callName(f, live(M), "Knockdown", [60]);
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			yield* g.callName(f, live(M), "Stun", [200]);
			yield* g.callName(f, live(M), "Unconscious", [80]);
		} else {
			yield* g.callName(f, live(M), "Jitter", [500]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "log_message", fmt("Honked from ＀. HONK!", [rt.fv(f, "name", live(f.src))]));
	_T = rt.getStep(f, live(f.src), 0);
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis"))])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.fv(f, "occupant", rt.sv(f, "chassis"))]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.fv(f, "occupant", rt.sv(f, "chassis"))])]);
	if (truthy(live(_T))) {
		$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	} else {
		$1 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ used a Mecha Honker in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀(＀) used a Mecha Honker in ＀", [rt.gv(f, "ckey", rt.fv(f, "occupant", rt.sv(f, "chassis"))), rt.fv(f, "occupant", rt.sv(f, "chassis")), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	return 1;
}, true);

rt.type(9638, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic", "/obj/item/mecha_parts/mecha_equipment/weapon", {
	projectiles: null,
	projectile_energy_cost: null,
	fire_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	name: "general ballisic weapon",
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/get_shot_amount  (code/game/mecha/equipment/weapons/weapons.dm:203)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/get_shot_amount", function get_shot_amount(f: Frame) {
	return rt.call(f, P("/proc/min"), null, [rt.sv(f, "projectiles"), rt.sv(f, "projectiles_per_shot")]);
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/action_checks  (code/game/mecha/equipment/weapons/weapons.dm:206)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/action_checks", function action_checks(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (rt.le(rt.sv(f, "projectiles"), 0)) {
		return 0;
	}
	return 1;
}, false, { args: ["target"] });

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/get_equip_info  (code/game/mecha/equipment/weapons/weapons.dm:213)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/get_equip_info", function get_equip_info(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	$0 = rt.callSuper(f, [], rt.Args.Same);
	$1 = rt.fv(f, "projectiles", live(f.src));
	if (rt.lt(rt.fv(f, "projectiles", live(f.src)), rt.initial(f, live(f.src), "projectiles"))) {
		$2 = fmt(" - <a href='?src=＃;rearm=1'>Rearm</a>", [live(f.src)]);
	} else {
		$2 = null;
	}
	return fmt("＀ [＀]＀", [$0, $1, $2]);
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/rearm  (code/game/mecha/equipment/weapons/weapons.dm:217)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/rearm", function* rearm(f: Frame) {
	let projectiles_to_add: Value = null;
	f.vars = () => [projectiles_to_add];
	if (rt.lt(rt.sv(f, "projectiles"), rt.initial(f, live(f.src), "projectiles"))) {
		projectiles_to_add = subtract(rt.initial(f, live(f.src), "projectiles"), rt.sv(f, "projectiles"));
		while (rt.ge((yield* g.callName(f, rt.sv(f, "chassis"), "get_charge", [])), rt.sv(f, "projectile_energy_cost")) && truthy(live(projectiles_to_add))) {
			rt.incSrcVar(f, "projectiles", 1, true);
			projectiles_to_add = rt.inc(live(projectiles_to_add), -1);
			yield* g.callName(f, rt.sv(f, "chassis"), "use_power", [rt.sv(f, "projectile_energy_cost")]);
		}
	}
	yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), (yield* g.callName(f, live(f.src), "get_equip_info", []))]);
	yield* g.srcCall(f, "log_message", fmt("Rearmed ＀.", [rt.fv(f, "name", live(f.src))]));
	return 1;
}, true);

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/needs_rearm  (code/game/mecha/equipment/weapons/weapons.dm:229)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/needs_rearm", function needs_rearm(f: Frame) {
	f.dot = (!rt.gt(rt.sv(f, "projectiles"), 0) ? 1 : 0);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/Topic  (code/game/mecha/equipment/weapons/weapons.dm:234)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.at(live(f.args[1]), "rearm"))) {
		yield* g.callName(f, live(f.src), "rearm", []);
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/action  (code/game/mecha/equipment/weapons/weapons.dm:240)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/proc/action", function* action(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	(rt.modSrcVar(f, "projectiles", (yield* g.srcCall(f, "get_shot_amount")), subtract));
	yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), (yield* g.callName(f, live(f.src), "get_equip_info", []))]);
	return 1;
}, true, { args: ["target"] });

rt.type(9644, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic", {
	missile_speed: 2,
	missile_range: 30,
	diags_first: 0,
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/proc/action  (code/game/mecha/equipment/weapons/weapons.dm:310)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/proc/action", function* action(f: Frame, target: Value) {
	let O: Value = null;
	f.vars = () => [target, O];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return live(f.dot);
	}
	O = (yield* g.new_(f, rt.sv(f, "projectile"), [rt.fv(f, "loc", rt.sv(f, "chassis"))]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "chassis"), rt.sv(f, "fire_sound"), 50, 1]);
	yield* g.srcCall(f, "log_message", fmt("Launched a ＀ from ＀, targeting ＀.", [rt.fv(f, "name", live(O)), rt.sv(f, "name"), live(target)]));
	rt.incSrcVar(f, "projectiles", -1, true);
	yield* g.srcCall(f, "proj_init", live(O));
	yield* g.callName(f, live(O), "throw_at", [null, live(target), null, rt.sv(f, "missile_range"), null, rt.sv(f, "missile_speed"), "spin", 0, "diagonals_first", rt.sv(f, "diags_first")], rt.Args.Named);
	return 1;
}, true);

rt.type(9645, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", {
	det_time: 20,
	projectile: rt.typePath("/obj/item/weapon/grenade/flashbang"),
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	projectiles: 6,
	missile_speed: 1.5,
	projectile_energy_cost: 800,
	equip_cooldown: 60,
	name: "１SGL-6 grenade launcher",
	desc: "A weapon for combat exosuits. Launches primed flashbangs.",
	icon_state: "mecha_grenadelnchr",
	origin_tech: "combat=4;engineering=4",
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang/proc/proj_init  (code/game/mecha/equipment/weapons/weapons.dm:339)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/flashbang/proc/proj_init", function* proj_init(f: Frame, F: Value) {
	let _T: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [F, _T, $0, $1, $2];
	_T = rt.getStep(f, live(f.src), 0);
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis"))])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.fv(f, "occupant", rt.sv(f, "chassis"))]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.fv(f, "occupant", rt.sv(f, "chassis"))])]);
	$1 = live(f.src);
	if (truthy(live(_T))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	} else {
		$2 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ fired a ＀ in ＀", [$0, $1, fmt("＀", [$2])]), 0, 1]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ fired a ＀ ＀", [(yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis"))])), live(f.src), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(F), P("/obj/item/weapon/grenade/flashbang/proc/prime")])), rt.sv(f, "det_time")]);
	return f.dot;
}, true);

rt.type(9647, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/banana_mortar", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", {
	projectile: rt.typePath("/obj/item/weapon/grown/bananapeel"),
	fire_sound: rt.rsc("sound/items/bikehorn.ogg"),
	projectiles: 15,
	missile_speed: 1.5,
	projectile_energy_cost: 100,
	equip_cooldown: 20,
	name: "banana mortar",
	desc: "Equipment for clown exosuits. Launches banana peels.",
	icon_state: "mecha_bananamrtr",
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/banana_mortar/proc/can_attach  (code/game/mecha/equipment/weapons/weapons.dm:365)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/banana_mortar/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha/combat/honker")) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

rt.type(9648, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/mousetrap_mortar", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", {
	projectile: rt.typePath("/obj/item/device/assembly/mousetrap/armed"),
	fire_sound: rt.rsc("sound/items/bikehorn.ogg"),
	projectiles: 15,
	missile_speed: 1.5,
	projectile_energy_cost: 100,
	equip_cooldown: 10,
	name: "mousetrap mortar",
	desc: "Equipment for clown exosuits. Launches armed mousetraps.",
	icon_state: "mecha_mousetrapmrtr",
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/mousetrap_mortar/proc/can_attach  (code/game/mecha/equipment/weapons/weapons.dm:382)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/mousetrap_mortar/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha/combat/honker")) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/mousetrap_mortar/proc/proj_init  (code/game/mecha/equipment/weapons/weapons.dm:388)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/mousetrap_mortar/proc/proj_init", function proj_init(f: Frame, M: Value) {
	rt.setFv(f, "secured", live(M), 1);
	return f.dot;
});

rt.type(9649, "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove", "/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher", {
	energy_drain: 250,
	equip_cooldown: 20,
	range: 3,
	missile_range: 5,
	fire_sound: rt.rsc("sound/items/bikehorn.ogg"),
	projectiles: 10,
	projectile_energy_cost: 500,
	diags_first: 1,
	name: "１Oingo Boingo Punch-face",
	desc: "Equipment for clown exosuits. Delivers fun right to your face!",
	icon_state: "mecha_punching_glove",
	projectile: rt.typePath("/obj/item/punching_glove"),
});

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove/proc/can_attach  (code/game/mecha/equipment/weapons/weapons.dm:407)
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha/combat/honker")) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove/proc/action  (code/game/mecha/equipment/weapons/weapons.dm:413)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove/proc/action", function* action(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.callName(f, rt.sv(f, "chassis"), "occupant_message", ["<font color='red' size='5'>HONK</font>"]);
	return f.dot;
}, true, { args: ["target"] });

// /obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove/proc/proj_init  (code/game/mecha/equipment/weapons/weapons.dm:418)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/weapon/ballistic/launcher/punching_glove/proc/proj_init", function* proj_init(f: Frame, PG: Value) {
	f.vars = () => [PG];
	if (!truthy((rt.istype(live(PG), T("/obj/item/punching_glove")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "chassis"), "Beam", [null, live(PG), "icon_state", "chain", "time", multiply(rt.sv(f, "missile_range"), 20), "maxdistance", add(rt.sv(f, "missile_range"), 2), "beam_sleep_time", 1], rt.Args.Named);
	return f.dot;
}, true);

rt.type(9650, "/obj/item/punching_glove", "/obj/item", {
	name: "punching glove",
	desc: "INCOMING HONKS",
	throwforce: 35,
	icon_state: "punching_glove",
});

// /obj/item/punching_glove/proc/throw_impact  (code/game/mecha/equipment/weapons/weapons.dm:430)  may sleep
rt.def("/obj/item/punching_glove/proc/throw_impact", function* throw_impact(f: Frame) {
	let AM: Value = null;
	f.vars = () => [AM];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (truthy((rt.istype(live(f.args[0]), T("/atom/movable")) ? 1 : 0))) {
		yield* g.callName(f, (AM = live(f.args[0])), "throw_at", [(yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(AM), rt.getDir(f, live(f.src), live(AM))])), 7, 2]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });
