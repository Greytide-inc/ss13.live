// From code/modules/awaymissions/capture_the_flag.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5643, "/obj/item/weapon/twohanded/ctf", "/obj/item/weapon/twohanded", {
	team: "white",
	reset_cooldown: 0,
	reset: null,
	reset_path: rt.typePath("/obj/effect/ctf/flag_reset"),
	throw_speed: 0,
	throw_range: 1,
	anchored: 1,
	name: "banner",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "banner",
	item_state: "banner",
	desc: "A banner with Nanotrasen's logo on it.",
	slowdown: 2,
	force: 200,
	armour_penetration: 1000,
	resistance_flags: 64,
});

// /obj/item/weapon/twohanded/ctf/proc/Destroy  (code/modules/awaymissions/capture_the_flag.dm:31)  may sleep
rt.def("/obj/item/weapon/twohanded/ctf/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "reset"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "reset")]);
		rt.setSv(f, "reset", null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/ctf/proc/Initialize  (code/modules/awaymissions/capture_the_flag.dm:36)  may sleep
rt.def("/obj/item/weapon/twohanded/ctf/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "slows_while_in_hand", 1);
	if (truthy(rt.sv(f, "reset"))) return f.dot;
	rt.setSv(f, "reset", (yield* g.new_(f, rt.sv(f, "reset_path"), [rt.getStep(f, live(f.src), 0)])));
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/ctf/proc/process  (code/modules/awaymissions/capture_the_flag.dm:42)  may sleep
rt.def("/obj/item/weapon/twohanded/ctf/proc/process", function* process(f: Frame) {
	let M: Value = null, mob_area: Value = null;
	let $e: any;
	f.vars = () => [M, mob_area, $e];
	if (!rt.gt(rt.worldTime(f), rt.sv(f, "reset_cooldown"))) return f.dot;
	yield* g.srcCall(f, "forceMove", rt.getStep(f, rt.fv(f, "reset", live(f.src)), 0));
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype((mob_area = (yield* g.call(f, P("/proc/get_area"), null, [live(M)]))), T("/area/ctf")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＄！ has been returned to base!</span>", [live(f.src)])]);
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/twohanded/ctf/proc/attack_hand  (code/modules/awaymissions/capture_the_flag.dm:51)  may sleep
rt.def("/obj/item/weapon/twohanded/ctf/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let M: Value = null, mob_area: Value = null;
	let $e: any;
	f.vars = () => [user, M, mob_area, $e];
	if (!truthy((yield* g.call(f, P("/proc/is_ctf_target"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Non players shouldn't be moving the flag!"]);
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, rt.sv(f, "team"), rt.fv(f, "faction", live(user))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You can't move your own flag!"]);
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "loc"), live(user))) {
		if (!truthy((yield* g.callName(f, live(user), "dropItemToGround", [live(f.src)])))) {
			return live(f.dot);
		}
	}
	rt.setSv(f, "anchored", 0);
	yield* g.srcCall(f, "pickup", live(user));
	if (!truthy((yield* g.callName(f, live(user), "put_in_active_hand", [live(f.src)])))) {
		yield* g.srcCall(f, "dropped", live(user));
		return live(f.dot);
	}
	rt.setFv(f, "anchored", live(user), 1);
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype((mob_area = (yield* g.call(f, P("/proc/get_area"), null, [live(M)]))), T("/area/ctf")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＄！ has been taken!</span>", [live(f.src)])]);
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/ctf/proc/dropped  (code/modules/awaymissions/capture_the_flag.dm:73)  may sleep
rt.def("/obj/item/weapon/twohanded/ctf/proc/dropped", function* dropped(f: Frame) {
	let M: Value = null, mob_area: Value = null;
	let $e: any;
	f.vars = () => [M, mob_area, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "anchored", live(f.args[0]), 0);
	rt.setSv(f, "reset_cooldown", add(rt.worldTime(f), 200));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype((mob_area = (yield* g.call(f, P("/proc/get_area"), null, [live(M)]))), T("/area/ctf")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＄！ has been dropped!</span>", [live(f.src)])]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "anchored", 1);
	return f.dot;
}, true, { args: ["user"] });

// /proc/toggle_all_ctf  (code/modules/awaymissions/capture_the_flag.dm:122)  may sleep
rt.def("/proc/toggle_all_ctf", function* toggle_all_ctf(f: Frame, user: Value) {
	let ctf_enabled: Value = null, CTF: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, ctf_enabled, CTF, $0, $1, $e];
	ctf_enabled = 0;
	CTF = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/capture_the_flag"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CTF = $e;
		ctf_enabled = (yield* g.callName(f, live(CTF), "toggle_ctf", []));
	}
	rt.endFor(f, 0);
	$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)]));
	if (truthy(live(ctf_enabled))) {
		$1 = "enabled";
	} else {
		$1 = "disabled";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has ＀ CTF!", [$0, $1])]);
	if (truthy(live(ctf_enabled))) {
		$0 = "enabled";
	} else {
		$0 = "disabled";
	}
	yield* g.call(f, P("/proc/notify_ghosts"), null, [fmt("CTF has been ＀!", [$0]), rt.rsc("sound/effects/ghost2.ogg")]);
	return f.dot;
}, true);

rt.type(10887, "/obj/machinery/capture_the_flag", "/obj/machinery", {
	team: "white",
	points: 0,
	points_to_win: 3,
	respawn_cooldown: 150,
	control_points: 0,
	control_points_to_win: 180,
	team_members: null,
	spawned_mobs: null,
	recently_dead_ckeys: null,
	ctf_enabled: 0,
	ctf_gear: rt.typePath("/datum/outfit/ctf"),
	instagib_gear: rt.typePath("/datum/outfit/ctf/instagib"),
	dead_barricades: null,
	anchored: 1,
	name: "CTF Controller",
	desc: "Used for running friendly games of capture the flag.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "syndbeacon",
	resistance_flags: 64,
}, { global: { ctf_object_typecache: 762, arena_reset: 763 } });

// /obj/machinery/capture_the_flag/proc/<init>  (code/modules/awaymissions/capture_the_flag.dm:142)
rt.def("/obj/machinery/capture_the_flag/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "team_members", rt.list());
	$0 = $0;
	rt.setSv(f, "spawned_mobs", rt.list());
	$0 = $0;
	rt.setSv(f, "recently_dead_ckeys", rt.list());
	$0 = $0;
	rt.setSv(f, "dead_barricades", rt.list());
	return f.dot;
});

// /obj/machinery/capture_the_flag/proc/Initialize  (code/modules/awaymissions/capture_the_flag.dm:155)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.gl("ctf_object_typecache"))) {
		rt.setGl("ctf_object_typecache", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.list(T("/turf"), T("/mob"), T("/area"), T("/obj/machinery"), T("/obj/structure"), T("/obj/effect/ctf"), T("/obj/item/weapon/twohanded/ctf"))])));
	}
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/Destroy  (code/modules/awaymissions/capture_the_flag.dm:169)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("poi_list"), "Remove", [live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/process  (code/modules/awaymissions/capture_the_flag.dm:173)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/process", function* process(f: Frame) {
	let i: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [i, M, $e];
	i = null;
	rt.forList(f, 0, rt.sv(f, "spawned_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(live(i))) {
			(rt.modSrcVar(f, "spawned_mobs", live(i), subtract));
			continue;
		}
		if ((truthy((yield* g.callName(f, (M = live(i)), "InCritical", []))) || isEqual(rt.fv(f, "stat", live(M)), 2))) {
			yield* g.srcCall(f, "ctf_dust_old", live(M));
		} else {
			yield* g.callName(f, live(M), "adjustBruteLoss", [-5]);
			yield* g.callName(f, live(M), "adjustFireLoss", [-5]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/capture_the_flag/proc/attack_ghost  (code/modules/awaymissions/capture_the_flag.dm:202)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let response: Value = null, new_team_member: Value = null, CTF: Value = null;
	let $e: any;
	f.vars = () => [user, response, new_team_member, CTF, $e];
	if (isEqual(rt.sv(f, "ctf_enabled"), 0)) {
		if ((truthy(rt.fv(f, "client", live(user))) && truthy(rt.gv(f, "holder", rt.fv(f, "client", live(user)))))) {
			if (isEqual((response = (yield* g.call(f, P("/proc/alert"), null, ["Enable CTF?", "CTF", "Yes", "No"]))), "Yes")) {
				yield* g.call(f, P("/proc/toggle_all_ctf"), null, [live(user)]);
			}
		}
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, rt.fv(f, "ckey", live(user)), rt.sv(f, "team_members")) ? 1 : 0))) {
		if (truthy((rt.isIn(f, rt.fv(f, "ckey", live(user)), rt.sv(f, "recently_dead_ckeys")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("It must be more than ＀ seconds from your last death to respawn!", [divide(rt.sv(f, "respawn_cooldown"), 10)])]);
			return live(f.dot);
		}
		new_team_member = rt.fv(f, "client", live(user));
		if ((truthy(rt.fv(f, "mind", live(user))) && truthy(rt.gv(f, "current", rt.fv(f, "mind", live(user)))))) {
			yield* g.srcCall(f, "ctf_dust_old", rt.gv(f, "current", rt.fv(f, "mind", live(user))));
		}
		yield* g.srcCall(f, "spawn_team_member", live(new_team_member));
		return live(f.dot);
	}
	CTF = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/capture_the_flag"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CTF = $e;
		if ((isEqual(live(CTF), live(f.src)) || isEqual(rt.fv(f, "ctf_enabled", live(CTF)), 0))) {
			continue;
		}
		if (truthy((rt.isIn(f, rt.fv(f, "ckey", live(user)), rt.fv(f, "team_members", live(CTF))) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "No switching teams while the round is going!"]);
			return live(f.dot);
		}
		if (rt.lt(rt.getLen(f, rt.fv(f, "team_members", live(CTF))), rt.getLen(f, rt.fv(f, "team_members", live(f.src))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ has more team members than ＀. Try joining ＀ to even things up.", [rt.fv(f, "team", live(f.src)), rt.fv(f, "team", live(CTF)), rt.fv(f, "team", live(CTF))])]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "team_members", rt.fv(f, "ckey", live(user)), rt.bitOr));
	new_team_member = rt.fv(f, "client", live(user));
	if ((truthy(rt.fv(f, "mind", live(user))) && truthy(rt.gv(f, "current", rt.fv(f, "mind", live(user)))))) {
		yield* g.srcCall(f, "ctf_dust_old", rt.gv(f, "current", rt.fv(f, "mind", live(user))));
	}
	yield* g.srcCall(f, "spawn_team_member", live(new_team_member));
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/ctf_dust_old  (code/modules/awaymissions/capture_the_flag.dm:237)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/ctf_dust_old", function* ctf_dust_old(f: Frame, body: Value) {
	let _T: Value = null;
	f.vars = () => [body, _T];
	if (!(truthy((rt.istype(live(body), T("/mob/living")) ? 1 : 0)) && truthy((rt.isIn(f, rt.sv(f, "team"), rt.fv(f, "faction", live(body))) ? 1 : 0)))) return f.dot;
	yield* g.new_(f, T("/obj/effect/ctf/ammo"), [(_T = rt.getStep(f, live(body), 0))]);
	rt.modSrcVar(f, "recently_dead_ckeys", rt.fv(f, "ckey", live(body)), add);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/capture_the_flag/proc/clear_cooldown"), rt.fv(f, "ckey", live(body))])), rt.sv(f, "respawn_cooldown"), 1]);
	yield* g.callName(f, live(body), "dust", []);
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/clear_cooldown  (code/modules/awaymissions/capture_the_flag.dm:245)
rt.def("/obj/machinery/capture_the_flag/proc/clear_cooldown", function clear_cooldown(f: Frame, ckey: Value) {
	(rt.modSrcVar(f, "recently_dead_ckeys", live(ckey), subtract));
	return f.dot;
});

// /obj/machinery/capture_the_flag/proc/spawn_team_member  (code/modules/awaymissions/capture_the_flag.dm:248)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/spawn_team_member", function* spawn_team_member(f: Frame, new_team_member: Value) {
	let M: Value = null;
	f.vars = () => [new_team_member, M];
	M = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.getStep(f, live(f.src), 0)]));
	yield* g.callName(f, rt.fv(f, "prefs", live(new_team_member)), "copy_to", [live(M)]);
	yield* g.callName(f, live(M), "set_species", [T("/datum/species/synth")]);
	rt.setFv(f, "key", live(M), rt.fv(f, "key", live(new_team_member)));
	rt.modField(f, live(M), "faction", rt.sv(f, "team"), add);
	yield* g.callName(f, live(M), "equipOutfit", [rt.sv(f, "ctf_gear")]);
	rt.modSrcVar(f, "spawned_mobs", live(M), add);
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/Topic  (code/modules/awaymissions/capture_the_flag.dm:257)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	f.vars = () => [href, href_list, ghost];
	if (!truthy(rt.at(live(href_list), "join"))) return f.dot;
	if (!truthy((rt.istype((ghost = live(f.usr)), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "attack_ghost", live(ghost));
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/attackby  (code/modules/awaymissions/capture_the_flag.dm:263)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let flag: Value = null, M: Value = null, mob_area: Value = null;
	let $e: any;
	f.vars = () => [I, user, params, flag, M, mob_area, $e];
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/twohanded/ctf")) ? 1 : 0))) return f.dot;
	if (!isEqual(rt.gv(f, "team", (flag = live(I))), rt.fv(f, "team", live(f.src)))) {
		yield* g.callName(f, live(user), "transferItemToLoc", [live(flag), rt.getStep(f, rt.fv(f, "reset", live(flag)), 0), 1]);
		rt.incSrcVar(f, "points", 1, true);
		M = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (truthy((rt.istype((mob_area = (yield* g.call(f, P("/proc/get_area"), null, [live(M)]))), T("/area/ctf")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀ has captured ％！, scoring a point for ＀ team! They now have ＀/＀ points!</span>", [rt.fv(f, "real_name", live(user)), live(flag), rt.sv(f, "team"), rt.sv(f, "points"), rt.sv(f, "points_to_win")])]);
			}
		}
		rt.endFor(f, 0);
	}
	if (!rt.ge(rt.sv(f, "points"), rt.sv(f, "points_to_win"))) return f.dot;
	yield* g.srcCall(f, "victory");
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/victory  (code/modules/awaymissions/capture_the_flag.dm:276)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/victory", function* victory(f: Frame) {
	let M: Value = null, mob_area: Value = null, W: Value = null, control: Value = null, CTF: Value = null;
	let $e: any;
	f.vars = () => [M, mob_area, W, control, CTF, $e];
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype((mob_area = (yield* g.call(f, P("/proc/get_area"), null, [live(M)]))), T("/area/ctf")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='narsie'>＀ team wins!</span>", [rt.sv(f, "team")])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>The game has been reset! Teams have been cleared. The machines will be active again in 30 seconds.</span>"]);
			W = null;
			rt.forList(f, 1, live(M), T("/obj/item/weapon/twohanded/ctf"));
			while (($e = rt.next(f, 1)) !== undefined) {
				W = $e;
				yield* g.callName(f, live(M), "dropItemToGround", [live(W)]);
			}
			rt.endFor(f, 1);
			yield* g.callName(f, live(M), "dust", []);
		}
	}
	rt.endFor(f, 0);
	control = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/control_point"));
	while (($e = rt.next(f, 0)) !== undefined) {
		control = $e;
		rt.setFv(f, "icon_state", live(control), "dominator");
		rt.setFv(f, "controlling", live(control), null);
	}
	rt.endFor(f, 0);
	CTF = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/capture_the_flag"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CTF = $e;
		if (isEqual(rt.fv(f, "ctf_enabled", live(CTF)), 1)) {
			rt.setFv(f, "points", live(CTF), 0);
			rt.setFv(f, "control_points", live(CTF), 0);
			rt.setFv(f, "ctf_enabled", live(CTF), 0);
			rt.setFv(f, "team_members", live(CTF), rt.list());
			rt.setGl("arena_reset", 0);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(CTF), P("/obj/machinery/capture_the_flag/proc/start_ctf")])), 300]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/toggle_ctf  (code/modules/awaymissions/capture_the_flag.dm:297)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/toggle_ctf", function* toggle_ctf(f: Frame) {
	if (!truthy(rt.sv(f, "ctf_enabled"))) {
		yield* g.srcCall(f, "start_ctf");
		f.dot = 1;
	} else {
		yield* g.srcCall(f, "stop_ctf");
		f.dot = 0;
	}
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/start_ctf  (code/modules/awaymissions/capture_the_flag.dm:306)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/start_ctf", function* start_ctf(f: Frame) {
	let d: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [d, D, $e];
	rt.setSv(f, "ctf_enabled", 1);
	d = null;
	rt.forList(f, 0, rt.sv(f, "dead_barricades"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		yield* g.callName(f, (D = live(d)), "respawn", []);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "dead_barricades"), "Cut", []);
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("＀ has been activated!", [rt.sv(f, "name")]), "enter_link", fmt("<a href=?src=＃;join=1>(Click to join the ＀ team!)</a> or click on the controller directly!", [live(f.src), rt.sv(f, "team")]), "source", live(f.src), "action", "attack"], rt.Args.Named);
	if (truthy(rt.gl("arena_reset"))) return f.dot;
	yield* g.srcCall(f, "reset_the_arena");
	rt.setGl("arena_reset", 1);
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/reset_the_arena  (code/modules/awaymissions/capture_the_flag.dm:319)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/reset_the_arena", function* reset_the_arena(f: Frame) {
	let A: Value = null, atm: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [A, atm, S, $e];
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	atm = null;
	rt.forList(f, 0, live(A));
	while (($e = rt.next(f, 0)) !== undefined) {
		atm = $e;
		if (!truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(atm), rt.gl("ctf_object_typecache")])))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(atm)]);
		}
		if (truthy((rt.istype(live(atm), T("/obj/structure")) ? 1 : 0))) {
			rt.setFv(f, "obj_integrity", (S = live(atm)), rt.fv(f, "max_integrity", live(S)));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/stop_ctf  (code/modules/awaymissions/capture_the_flag.dm:330)  may sleep
rt.def("/obj/machinery/capture_the_flag/proc/stop_ctf", function* stop_ctf(f: Frame) {
	let A: Value = null, i: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [A, i, M, $e];
	rt.setSv(f, "ctf_enabled", 0);
	rt.setGl("arena_reset", 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	i = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		M = live(i);
		if ((isEqual((yield* g.call(f, P("/proc/get_area"), null, [live(A)])), live(A)) && truthy((rt.isIn(f, rt.fv(f, "ckey", live(M)), rt.sv(f, "team_members")) ? 1 : 0)))) {
			yield* g.callName(f, live(M), "dust", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "team_members"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "spawned_mobs"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "recently_dead_ckeys"), "Cut", []);
	return f.dot;
}, true);

// /obj/machinery/capture_the_flag/proc/instagib_mode  (code/modules/awaymissions/capture_the_flag.dm:340)
rt.def("/obj/machinery/capture_the_flag/proc/instagib_mode", function instagib_mode(f: Frame) {
	let CTF: Value = null;
	let $e: any;
	f.vars = () => [CTF, $e];
	CTF = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/capture_the_flag"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CTF = $e;
		if (isEqual(rt.fv(f, "ctf_enabled", live(CTF)), 1)) {
			rt.setFv(f, "ctf_gear", live(CTF), rt.fv(f, "instagib_gear", live(CTF)));
			rt.setFv(f, "respawn_cooldown", live(CTF), 50);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/capture_the_flag/proc/normal_mode  (code/modules/awaymissions/capture_the_flag.dm:346)
rt.def("/obj/machinery/capture_the_flag/proc/normal_mode", function normal_mode(f: Frame) {
	let CTF: Value = null;
	let $e: any;
	f.vars = () => [CTF, $e];
	CTF = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/capture_the_flag"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CTF = $e;
		if (isEqual(rt.fv(f, "ctf_enabled", live(CTF)), 1)) {
			rt.setFv(f, "ctf_gear", live(CTF), rt.initial(f, live(f.src), "ctf_gear"));
			rt.setFv(f, "respawn_cooldown", live(CTF), 150);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(5205, "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf", "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle", {
	desc: "This looks like it could really hurt in melee.",
	force: 75,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m50/ctf"),
});

// /obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf/proc/dropped  (code/modules/awaymissions/capture_the_flag.dm:357)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf/proc/floor_vanish")])), 1]);
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf/proc/floor_vanish  (code/modules/awaymissions/capture_the_flag.dm:361)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf/proc/floor_vanish", function* floor_vanish(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(8798, "/obj/item/projectile/bullet/ctf", "/obj/item/projectile/bullet", {
	damage: 0,
});

// /obj/item/projectile/bullet/ctf/proc/prehit  (code/modules/awaymissions/capture_the_flag.dm:374)
rt.def("/obj/item/projectile/bullet/ctf/proc/prehit", function prehit(f: Frame) {
	if (truthy(rt.call(f, P("/proc/is_ctf_target"), null, [live(f.args[0])]))) {
		rt.setSv(f, "damage", 60);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["target"] });

rt.type(5212, "/obj/item/weapon/gun/ballistic/automatic/laser/ctf", "/obj/item/weapon/gun/ballistic/automatic/laser", {
	desc: "This looks like it could really hurt in melee.",
	force: 50,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf"),
});

// /obj/item/weapon/gun/ballistic/automatic/laser/ctf/proc/dropped  (code/modules/awaymissions/capture_the_flag.dm:384)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/proc/floor_vanish")])), 1]);
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/automatic/laser/ctf/proc/floor_vanish  (code/modules/awaymissions/capture_the_flag.dm:388)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/proc/floor_vanish", function* floor_vanish(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(9889, "/obj/item/ammo_box/magazine/recharge/ctf", "/obj/item/ammo_box/magazine/recharge", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/laser/ctf"),
});

// /obj/item/ammo_box/magazine/recharge/ctf/proc/dropped  (code/modules/awaymissions/capture_the_flag.dm:395)  may sleep
rt.def("/obj/item/ammo_box/magazine/recharge/ctf/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/ammo_box/magazine/recharge/ctf/proc/floor_vanish")])), 1]);
	return f.dot;
}, true);

// /obj/item/ammo_box/magazine/recharge/ctf/proc/floor_vanish  (code/modules/awaymissions/capture_the_flag.dm:399)  may sleep
rt.def("/obj/item/ammo_box/magazine/recharge/ctf/proc/floor_vanish", function* floor_vanish(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(8863, "/obj/item/projectile/beam/ctf", "/obj/item/projectile/beam", {
	damage: 0,
	icon_state: "omnilaser",
});

// /obj/item/projectile/beam/ctf/proc/prehit  (code/modules/awaymissions/capture_the_flag.dm:410)
rt.def("/obj/item/projectile/beam/ctf/proc/prehit", function prehit(f: Frame) {
	if (truthy(rt.call(f, P("/proc/is_ctf_target"), null, [live(f.args[0])]))) {
		rt.setSv(f, "damage", 150);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["target"] });

// /proc/is_ctf_target  (code/modules/awaymissions/capture_the_flag.dm:416)
rt.def("/proc/is_ctf_target", function is_ctf_target(f: Frame, target: Value) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = 0;
	if (truthy((rt.istype(live(target), T("/obj/structure/barricade/security/ctf")) ? 1 : 0))) {
		f.dot = 1;
	}
	if (!truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!truthy((rt.istype(rt.gv(f, "wear_suit", (H = live(target))), T("/obj/item/clothing/suit/space/hardsuit/shielded/ctf")) ? 1 : 0))) return f.dot;
	f.dot = 1;
	return f.dot;
});

rt.type(631, "/datum/outfit/ctf", "/datum/outfit", {
	name: "CTF",
	toggle_helmet: 0,
	ears: rt.typePath("/obj/item/device/radio/headset"),
	uniform: rt.typePath("/obj/item/clothing/under/syndicate"),
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/ctf"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/combat"),
	id: rt.typePath("/obj/item/weapon/card/id/syndicate"),
	belt: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/ctf"),
	l_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf"),
	r_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf"),
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/laser/ctf"),
});

// /datum/outfit/ctf/proc/post_equip  (code/modules/awaymissions/capture_the_flag.dm:470)
rt.def("/datum/outfit/ctf/proc/post_equip", function post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let no_drops: Value = null, W: Value = null, i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [visualsOnly, no_drops, W, i, I, $e];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	if (truthy(live(visualsOnly))) {
		return live(f.dot);
	}
	no_drops = rt.list();
	no_drops = rt.modify(live(no_drops), (W = rt.fv(f, "wear_id", live(H))), add);
	rt.setFv(f, "registered_name", live(W), rt.fv(f, "real_name", live(H)));
	rt.callName(f, live(W), "update_label", [rt.fv(f, "registered_name", live(W)), rt.fv(f, "assignment", live(W))]);
	no_drops = rt.modify(live(no_drops), rt.callName(f, live(H), "get_item_by_slot", [9]), add);
	no_drops = rt.modify(live(no_drops), rt.callName(f, live(H), "get_item_by_slot", [12]), add);
	no_drops = rt.modify(live(no_drops), rt.callName(f, live(H), "get_item_by_slot", [14]), add);
	no_drops = rt.modify(live(no_drops), rt.callName(f, live(H), "get_item_by_slot", [7]), add);
	i = null;
	rt.forList(f, 0, live(no_drops));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(rt.modField(f, (I = live(i)), "flags", 2, rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(633, "/datum/outfit/ctf/red", "/datum/outfit/ctf", {
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/ctf/red"),
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/red"),
	l_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/red"),
	r_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/red"),
});

// /datum/outfit/ctf/red/proc/post_equip  (code/modules/awaymissions/capture_the_flag.dm:510)
rt.def("/datum/outfit/ctf/red/proc/post_equip", function post_equip(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, (R = rt.fv(f, "ears", live(f.args[0]))), "set_frequency", [1215]);
	rt.setFv(f, "freqlock", live(R), 1);
	rt.setFv(f, "independent", live(R), 1);
	rt.setFv(f, "stunmod", rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))), 0);
	return f.dot;
}, false, { args: ["H"] });

rt.type(635, "/datum/outfit/ctf/blue", "/datum/outfit/ctf", {
	suit: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/ctf/blue"),
	r_hand: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/laser/ctf/blue"),
	l_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/blue"),
	r_pocket: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/blue"),
});

// /datum/outfit/ctf/blue/proc/post_equip  (code/modules/awaymissions/capture_the_flag.dm:518)
rt.def("/datum/outfit/ctf/blue/proc/post_equip", function post_equip(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, (R = rt.fv(f, "ears", live(f.args[0]))), "set_frequency", [1217]);
	rt.setFv(f, "freqlock", live(R), 1);
	rt.setFv(f, "independent", live(R), 1);
	rt.setFv(f, "stunmod", rt.gv(f, "species", rt.fv(f, "dna", live(f.args[0]))), 0);
	return f.dot;
}, false, { args: ["H"] });

rt.type(12887, "/obj/structure/trap/ctf", "/obj/structure/trap", {
	team: "white",
	time_between_triggers: 1,
	anchored: 1,
	name: "Spawn protection",
	desc: "Stay outta the enemy spawn!",
	icon_state: "trap",
	resistance_flags: 64,
	alpha: 255,
});

// /obj/structure/trap/ctf/proc/trap_effect  (code/modules/awaymissions/capture_the_flag.dm:541)  may sleep
rt.def("/obj/structure/trap/ctf/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	f.vars = () => [L];
	if (!truthy((yield* g.call(f, P("/proc/is_ctf_target"), null, [live(L)])))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, rt.fv(f, "team", live(f.src)), rt.fv(f, "faction", live(L))) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='danger'><B>Stay out of the enemy spawn!</B></span>"]);
	yield* g.callName(f, live(L), "death", []);
	return f.dot;
}, true);

rt.type(12548, "/obj/structure/barricade/security/ctf", "/obj/structure/barricade/security", {
	deploy_time: 0,
	deploy_message: 0,
	name: "barrier",
	desc: "A barrier. Provides cover in fire fights.",
});

// /obj/structure/barricade/security/ctf/proc/make_debris  (code/modules/awaymissions/capture_the_flag.dm:562)  may sleep
rt.def("/obj/structure/barricade/security/ctf/proc/make_debris", function* make_debris(f: Frame) {
	yield* g.new_(f, T("/obj/effect/ctf/dead_barricade"), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);

rt.type(12044, "/obj/effect/ctf/ammo", "/obj/effect/ctf", {
	name: "ammo pickup",
	desc: "You like revenge, right? Everybody likes revenge! Well, let's go get some!",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "at_shield1",
	layer: 4.1,
	alpha: 255,
	invisibility: 0,
});

// /obj/effect/ctf/ammo/proc/Initialize  (code/modules/awaymissions/capture_the_flag.dm:582)  may sleep
rt.def("/obj/effect/ctf/ammo/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 300, 8]);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/effect/ctf/ammo/proc/Crossed  (code/modules/awaymissions/capture_the_flag.dm:586)  may sleep
rt.def("/obj/effect/ctf/ammo/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	yield* g.srcCall(f, "reload", live(AM));
	return f.dot;
}, true);

// /obj/effect/ctf/ammo/proc/Bump  (code/modules/awaymissions/capture_the_flag.dm:589)  may sleep
rt.def("/obj/effect/ctf/ammo/proc/Bump", function* Bump(f: Frame, AM: Value) {
	f.vars = () => [AM];
	yield* g.srcCall(f, "reload", live(AM));
	return f.dot;
}, true);

// /obj/effect/ctf/ammo/proc/Bumped  (code/modules/awaymissions/capture_the_flag.dm:592)  may sleep
rt.def("/obj/effect/ctf/ammo/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	f.vars = () => [AM];
	yield* g.srcCall(f, "reload", live(AM));
	return f.dot;
}, true);

// /obj/effect/ctf/ammo/proc/reload  (code/modules/awaymissions/capture_the_flag.dm:595)  may sleep
rt.def("/obj/effect/ctf/ammo/proc/reload", function* reload(f: Frame, M: Value) {
	let CTF: Value = null, outfit: Value = null, O: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [M, CTF, outfit, O, G, $e];
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	CTF = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/capture_the_flag"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CTF = $e;
		if (truthy((rt.isIn(f, live(M), rt.fv(f, "spawned_mobs", live(CTF))) ? 1 : 0))) {
			outfit = rt.fv(f, "ctf_gear", live(CTF));
			O = (yield* g.new_(f, live(outfit), []));
			G = null;
			rt.forList(f, 1, live(M), T("/obj/item/weapon/gun"));
			while (($e = rt.next(f, 1)) !== undefined) {
				G = $e;
				yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
			}
			rt.endFor(f, 1);
			yield* g.callName(f, live(O), "equip", [live(M)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>Ammunition reloaded!</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(M), 0), rt.rsc("sound/weapons/shotgunpump.ogg"), 50, 1, -1]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12045, "/obj/effect/ctf/dead_barricade", "/obj/effect/ctf", {
	name: "dead barrier",
	desc: "It provided cover in fire fights. And now it's gone.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "barrier0",
});

// /obj/effect/ctf/dead_barricade/proc/Initialize  (code/modules/awaymissions/capture_the_flag.dm:616)
rt.def("/obj/effect/ctf/dead_barricade/proc/Initialize", function Initialize(f: Frame) {
	let CTF: Value = null;
	let $e: any;
	f.vars = () => [CTF, $e];
	rt.callSuper(f, [], rt.Args.Same);
	CTF = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/capture_the_flag"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CTF = $e;
		rt.modField(f, live(CTF), "dead_barricades", live(f.src), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/effect/ctf/dead_barricade/proc/respawn  (code/modules/awaymissions/capture_the_flag.dm:621)  may sleep
rt.def("/obj/effect/ctf/dead_barricade/proc/respawn", function* respawn(f: Frame) {
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	yield* g.new_(f, T("/obj/structure/barricade/security/ctf"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10890, "/obj/machinery/control_point", "/obj/machinery", {
	controlling: null,
	team: "none",
	point_rate: 1,
	anchored: 1,
	name: "control point",
	desc: "You should capture this.",
	icon: rt.rsc("icons/obj/machines/dominator.dmi"),
	icon_state: "dominator",
	resistance_flags: 64,
});

// /obj/machinery/control_point/proc/process  (code/modules/awaymissions/capture_the_flag.dm:642)  may sleep
rt.def("/obj/machinery/control_point/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "controlling"))) return f.dot;
	rt.modField(f, rt.sv(f, "controlling"), "control_points", rt.sv(f, "point_rate"), add);
	if (!rt.ge(rt.fv(f, "control_points", rt.sv(f, "controlling")), rt.fv(f, "control_points_to_win", rt.sv(f, "controlling")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "controlling"), "victory", []);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/control_point/proc/attackby  (code/modules/awaymissions/capture_the_flag.dm:646)  may sleep
rt.def("/obj/machinery/control_point/proc/attackby", function* attackby(f: Frame, user: Value, params: Value) {
	f.vars = () => [user, params];
	yield* g.srcCall(f, "capture", live(user));
	return f.dot;
}, true);

// /obj/machinery/control_point/proc/attack_hand  (code/modules/awaymissions/capture_the_flag.dm:649)  may sleep
rt.def("/obj/machinery/control_point/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "capture", live(user));
	return f.dot;
}, true);

// /obj/machinery/control_point/proc/capture  (code/modules/awaymissions/capture_the_flag.dm:652)  may sleep
rt.def("/obj/machinery/control_point/proc/capture", function* capture(f: Frame, user: Value) {
	let CTF: Value = null, M: Value = null, mob_area: Value = null;
	let $e: any;
	f.vars = () => [user, CTF, M, mob_area, $e];
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, "target", live(f.src)], rt.Args.Named)))) return f.dot;
	CTF = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/capture_the_flag"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CTF = $e;
		if ((truthy(rt.fv(f, "ctf_enabled", live(CTF))) && truthy((rt.isIn(f, rt.fv(f, "ckey", live(user)), rt.fv(f, "team_members", live(CTF))) ? 1 : 0)))) {
			rt.setSv(f, "controlling", live(CTF));
			rt.setSv(f, "icon_state", fmt("dominator-＀", [rt.fv(f, "team", live(CTF))]));
			M = null;
			rt.forList(f, 1, rt.gl("player_list"), T("/mob"));
			while (($e = rt.next(f, 1)) !== undefined) {
				M = $e;
				if (truthy((rt.istype((mob_area = (yield* g.call(f, P("/proc/get_area"), null, [live(M)]))), T("/area/ctf")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>＀ has captured ％！, claiming it for ＀! Go take it back!</span>", [rt.fv(f, "real_name", live(user)), live(f.src), rt.fv(f, "team", live(CTF))])]);
				}
			}
			rt.endFor(f, 1);
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
